# Generated by Django 5.1.4 on 2025-01-12 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_order_orderitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="razorpay_order_id",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
