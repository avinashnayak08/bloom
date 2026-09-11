import os

def write_file(rel_path, content):
    os.makedirs(os.path.dirname(rel_path), exist_ok=True)
    with open(rel_path, "w", encoding="utf-8") as f:
        f.write(content)

write_file("test_dir/test.txt", "hello")
print("Works!")
